import React, { useMemo } from 'react';
import styles from './index.module.css';
import { Avatar } from './Avatar';
import { useOthers, useSelf } from '@/liveblocks.config';
import { generateRandomName } from '@/lib/utils';

export const ActiveUsers = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  console.log(currentUser);

  const memoizedUsers = useMemo(() => {
    return (
      <div className='flex items-center justify-center gap-1 py-2'>
        <div className='flex pl-3'>
          {currentUser && (
            <Avatar
              name='You'
              otherStyles='border-[3px] border-primary-green'
            />
          )}
          {users.slice(0, 3).map(({ connectionId, info }) => {
            return (
              <Avatar
                key={connectionId}
                name={generateRandomName()}
                otherStyles='-ml-3'
              />
            );
          })}

          {hasMoreUsers && (
            <div className={styles.more}>+{users.length - 3}</div>
          )}
        </div>
      </div>
    );
  }, [users.length]);

  return memoizedUsers;
};
