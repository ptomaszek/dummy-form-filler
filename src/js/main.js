import { DummyFormFiller } from './dummy-engine.js';

export function run() {
    try {
        console.log('Run Dummy Form Filler');
        const filler = new DummyFormFiller();
        filler.populateDummyData();
    } catch (e) {
        console.error('Cannot run Dummy Form Filler - raise an issue on https://github.com/ptomaszek/dummy-form-filler/issues');
        console.error(e);
    }
}
