import DataLoader from 'dataloader';
import { batchFindUsers } from './db.js';

const buildDataloaders = () => ({
  authorLoader: new DataLoader(ids => batchFindUsers(ids), {
    cacheKeyFn: key => key.toString(),
  }),
});

export { buildDataloaders };
