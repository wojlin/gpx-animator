class Recorder
{
    constructor()
    {
        this.isRecording = false;

        this.recordingPanel = document.getElementById("recording-panel");
        this.preview = document.getElementById("recording-preview");
        this.recording = document.getElementById("recording-screen");
        this.downloadButton = document.getElementById("download-recording-button");
        this.recorder;
    }


    showRecordingPanel()
    {
        this.recordingPanel.style.display = 'block';
    }

    hideRecordingPanel()
    {
        this.recordingPanel.style.display = 'none';
    }

    startInside(stream) 
    {
        console.log('pre recording');

        //start recording
        this.recorder = new MediaRecorder(stream); //api to record media in javascript provides different functionalities
        // as media pause, resume, start, stop, requestData - request blob of recorded media
        let data = [];
      
        //ondataavailable - fires periodically each time timeslice milliseconds of media have been recorded or
        //when the entire media is recorded if no timeslice is specified
        this.recorder.ondataavailable = (event) => data.push(event.data);
        this.recorder.start(); //strt the recording
      
        console.log('Recording...');
      
        //when stopped it will resolve the promise
        let stopped = new Promise((resolve, reject) => 
        {
            this.recorder.onstop = resolve;
            this.recorder.onerror = (event) => reject(event.name);
        });
      
        //when stopped it will return the data when it is recorded and stopped completely
        return Promise.all([stopped, this.recorder]).then(() => data);
    }
      
    stopInside(stream) 
    {
        console.log("stopping");
        if (this.recorder.state == "recording") 
        {
            this.recorder.stop();
        }
      
        //getTracks = returns a sequence that represents all the MediaStreamTrack objects and stops
        //all them
        stream.getTracks().forEach((track) => track.stop());
        
    }
      

    record()
    {
        this.isRecording = true;
        console.log("1. recording setup");
        
        navigator.mediaDevices.getDisplayMedia({video: true, audio: true,}).then((stream) => 
        {
          console.log("2. recording started");
          //stream - MediaStreamTrack
          this.preview.srcObject = stream;
          // downloadButton.href = stream;
          this.preview.captureStream = this.preview.captureStream || this.preview.mozCaptureStream;
          return new Promise((resolve) => (this.preview.onplaying = resolve));
        })
        .then(() => this.startInside(this.preview.captureStream()))
        .then((recordedChunks) => 
            {
                console.log("3. stopped recoding");
                let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
                this.recording.src = URL.createObjectURL(recordedBlob);
                this.downloadButton.href = this.recording.src;
                this.downloadButton.download = "RecordedVideo.webm";
        
                console.log(
                    "Successfully recorded " +
                    recordedBlob.size +
                    " bytes of " +
                    recordedBlob.type +
                    " media."
                );
            }
        )
    }

    stop()
    {
        this.isRecording = false;
        this.stopInside(this.preview.srcObject);
        
    }
      
      
      

}

var recorder = new Recorder();
