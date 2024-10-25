import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Import Spanish locale for dayjs

/**
 * Formats a date to a localized string representation using dayjs.
 *
 * This function takes a date object or a timestamp and converts it into a
 * human-readable string based on the user's local settings. It allows
 * specifying a custom format for the output date string.
 *
 * @param {Date|number|string} date - The date to be formatted, can be a Date object,
 * a timestamp in milliseconds, or a date string.
 * @param {string} [locale='en'] - Optional locale string for formatting
 * the date (e.g., 'fr' for French, 'es' for Spanish). Defaults to 'en'.
 * @param {string} [format='MMMM D, YYYY'] - Optional format string for the
 * output date. Defaults to 'MMMM D, YYYY'.
 * @returns {string} - The formatted date string according to the specified locale and format.
 *
 * @example
 * // returns "October 25, 2024" if the locale is 'en'
 * formatToLocal(new Date('2024-10-25'));
 *
 * @example
 * // returns "25 octobre 2024" if the locale is 'fr'
 * formatToLocal(new Date('2024-10-25'), 'fr');
 *
 * @example
 * // returns "2024-10-25" if the custom format is used
 * formatToLocal(new Date('2024-10-25'), 'en', 'YYYY-MM-DD');
 *
 * @example
 * // returns "25 de octubre de 2024" if the locale is 'es'
 * formatToLocal(new Date('2024-10-25'), 'es');
 */
export const formatToLocal = (date, locale = 'en', format = 'MMMM D, YYYY') => {
    // Check if date is of a valid type: ConfigType
    if (!dayjs.isDayjs(dayjs(date))) {
        throw new TypeError('Expected a Date object, a timestamp in milliseconds, or a date string.');
    }

    // Set the locale for dayjs
    dayjs.locale(locale);

    // Format the date using dayjs with the specified format
    return dayjs(date).format(format);
};
