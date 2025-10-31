// A simple Lehmer (aka Park-Miller) PRNG.
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator
// This is used to ensure that game runs are deterministic and reproducible from a seed.
export class SeededRNG {
    private seed: number;

    constructor(seed: string) {
        this.seed = this.hash(seed);
    }

    private hash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Returns a float between 0 (inclusive) and 1 (exclusive)
    next(): number {
        // LCG parameters
        const a = 48271;
        const m = 2147483647;
        this.seed = (this.seed * a) % m;
        return this.seed / m;
    }

    // Returns an integer between min (inclusive) and max (exclusive)
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min)) + min;
    }

    // Returns a random element from an array
    choice<T>(arr: T[]): T {
        return arr[this.nextInt(0, arr.length)];
    }
    
    // Box-Muller transform to get a normally distributed random number
    // returns a value with mean 0 and stddev 1
    nextNormal(): number {
        let u = 0, v = 0;
        while(u === 0) u = this.next(); //Converting [0,1) to (0,1)
        while(v === 0) v = this.next();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }
}
