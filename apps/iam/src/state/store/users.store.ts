import { IRegisterAccountRequest, IUser } from '@mixcore/sdk-client';
import { injectMixClient, withMixClient } from '@mixcore/sdk-client-ng';
import { setEntity, withCRUD } from '@mixcore/signal';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { from } from 'rxjs';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withCRUD<IUser>({
    apiFactory: () =>
      withMixClient((client) => ({
        fetchFn: (query) => client.auth.getUsers(query),
        getByIdFn: (id) => client.auth.getUserProfileById(<string>id),
        deleteFn: (id) => client.auth.removeUserById(<string>id),
        updateFn: (user) => client.auth.updateUserProfile(user),
        createFn: (request: IRegisterAccountRequest) =>
          client.auth.register(request).then(
            (r) =>
              ({
                userName: r.info.username,
                email: r.info.email,
                id: r.info.parentId,
                createdDateTime: new Date().toDateString(),
              }) as IUser,
          ),
      })),
  }),
  withMethods((store, client = injectMixClient()) => ({
    changeUserRole: (
      userId: string,
      roleId: string,
      roleName: string,
      isChecked: boolean,
    ) => {
      return from(
        client.auth.updateUserRole({ roleId, userId, roleName }, isChecked),
      ).pipe(
        tapResponse({
          next: () => {
            const user = store.selectEntityById(userId)();
            if (user) {
              user.roles = [...user.roles, { roleId, userId }];
            }

            setEntity(store, user);
          },
          error: (error) => {
            console.error('Failed to change user role:', error);
          },
        }),
      );
    },
  })),
);
