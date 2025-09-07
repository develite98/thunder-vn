import { Router } from '@angular/router';

export const onGoBack = (defaultUrl: string[], router: Router) => {
  if (history.length > 1) {
    history.back();
  } else {
    router.navigate(defaultUrl);
    return;
  }
};
