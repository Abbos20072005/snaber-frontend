/**
 * Options for converting data to FormData
 */
interface ToFormDataOptions {
  /**
   * If true, skip undefined values (useful for PATCH requests)
   * @default false
   */
  skipUndefined?: boolean;
}

/**
 * Converts any object to FormData for multipart/form-data requests
 *
 * @param data - The object to convert to FormData
 * @param options - Configuration options
 * @returns FormData instance with all fields from the object
 *
 * @example
 * ```ts
 * const data = { name: 'Product', price: 100, images: [file1, file2] };
 * const formData = toFormData(data);
 * ```
 *
 * @example
 * ```ts
 * // For PATCH requests, skip undefined values
 * const partialData = { name: 'Updated', price: undefined };
 * const formData = toFormData(partialData, { skipUndefined: true });
 * ```
 */
export const toFormData = <T extends Record<string, any>>(
  data: T,
  options: ToFormDataOptions = {}
): FormData => {
  const { skipUndefined = false } = options;
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    // Skip undefined values if option is enabled
    if (skipUndefined && value === undefined) {
      continue;
    }

    // Skip null values
    if (value === null) {
      continue;
    }

    // Handle File arrays (e.g., images: File[])
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      value.forEach((file) => {
        formData.append(key, file);
      });
      continue;
    }

    // Handle single File
    if (value instanceof File) {
      formData.append(key, value);
      continue;
    }

    // Handle arrays of non-File values (convert to JSON string or comma-separated)
    if (Array.isArray(value)) {
      // For arrays, you might want to append each item separately or as JSON
      // This implementation appends each item with the same key
      value.forEach((item) => {
        formData.append(key, String(item));
      });
      continue;
    }

    // Handle primitives: convert to string
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      formData.append(key, String(value));
      continue;
    }

    // Handle objects: convert to JSON string
    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      continue;
    }
  }

  return formData;
};
