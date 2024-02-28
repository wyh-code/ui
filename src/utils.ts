
export const class_prefix = 'ostore-ui';

export const classNames = (names: string|string[]) => {
  if(!Array.isArray(names)){
    names = [names];
  }
  return names.map(name => `${class_prefix}-${name}`).join(' ');
};
