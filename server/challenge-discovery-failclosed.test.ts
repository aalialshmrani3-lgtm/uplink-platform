import { beforeEach, describe, expect, it, vi } from 'vitest';

const getAllChallenges = vi.hoisted(() => vi.fn());

vi.mock('./db', () => ({
  getAllChallenges,
}));

import { appRouter } from './routers';

describe('Challenge discovery failure handling', () => {
  beforeEach(() => {
    getAllChallenges.mockReset();
  });

  it('propagates a data-store failure instead of returning a misleading empty list', async () => {
    getAllChallenges.mockRejectedValueOnce(new Error('test datastore unavailable'));
    const caller = appRouter.createCaller({ user: null } as any);

    await expect(caller.challenge.getActiveChallenges()).rejects.toThrow('test datastore unavailable');
  });

  it('returns only the documented discovery fields when open challenges exist', async () => {
    getAllChallenges.mockResolvedValueOnce([{ id: 41, title: 'Synthetic challenge', category: 'energy', privateNote: 'not disclosed' }]);
    const caller = appRouter.createCaller({ user: null } as any);

    await expect(caller.challenge.getActiveChallenges()).resolves.toEqual([{ id: 41, title: 'Synthetic challenge', category: 'energy' }]);
  });
});
