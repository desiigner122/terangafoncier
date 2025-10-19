const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const slugify = (value = '') => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
};

export const generatePropertySlug = (title = '', id) => {
  const base = slugify(title) || 'terrain';

  if (id && UUID_REGEX.test(id)) {
    return `${base}--${id}`;
  }

  if (id) {
    return `${base}-${id}`;
  }

  return base;
};

export const extractIdFromPropertySlug = (param) => {
  if (!param) {
    return { id: null, slug: null };
  }

  const uuidMatch = param.match(UUID_REGEX);
  if (uuidMatch) {
    const id = uuidMatch[0];
    const separator = `--${id}`;
    const separatorIndex = param.lastIndexOf(separator);
    const slug = separatorIndex !== -1 ? param.slice(0, separatorIndex) : param.replace(id, '').replace(/--?$/, '');
    return { id, slug: slug || null };
  }

  return { id: null, slug: param };
};

export const isUUID = (value) => UUID_REGEX.test(value);
