export const onGoBack = (callBack: () => void) => {
  if (history.length > 1) {
    history.back();
  } else {
    callBack?.();
    return;
  }
};
