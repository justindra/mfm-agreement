import { SSTConfig } from 'sst';
import { Main } from './stacks/main';

export default {
  config(_input) {
    return {
      name: 'mfm-agreement',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(Main, { id: 'main' });
  },
} satisfies SSTConfig;
