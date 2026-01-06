export const autoScroll = {
  mounted(el, binding) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: binding.value?.behavior || 'auto',
    });
  },
  updated(el, binding) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: binding.value?.behavior || 'auto',
    });
  },
};
