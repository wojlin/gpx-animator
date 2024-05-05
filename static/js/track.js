class Track {
    constructor(points) {
        this.points = points;
        this.addDistance();
    }

    // Function to calculate distance between two points
    distance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371.009; // Mean radius in kilometers

        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = earthRadius * c; // Distance in kilometers
        return d;
    }

    // Function to convert degrees to radians
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Function to add distance from start to each point in the array
    addDistance() {
        let totalDistance = 0;
        this.points[0].push(0);
        for (let i = 1; i < this.points.length; i++) {
            const [lat1, lon1] = this.points[i - 1];
            const [lat2, lon2] = this.points[i];
            const dist = this.distance(lat1, lon1, lat2, lon2);
            totalDistance += dist;
            this.points[i].push(totalDistance);
        }
    }
}