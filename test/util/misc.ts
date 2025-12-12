import { IterableCollection, map } from 'async';

/**
 * Converts an itemName into an elementId (removing spaces, symbols, etc.)
 * @param itemName The item's name
 * @returns elementId
 */
export function nameToId(itemName: string) {
  return itemName.replace(/\s/g, '-').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\./g, '\\.').toLowerCase();
}

/**
 * Checks that the order in which strings are sorted on a page matches the expected order
 * when the appropriate sorting algorithm is applied.
 * @param array An array of WebdriverIO elements
 * @param sortFunction The function to use to sort the array of elements
 */
export async function compareSortedStringArrays(
  array: IterableCollection<WebdriverIO.Element>,
  sortFunction: (val1: string, val2: string) => number
) {
  const actualArray = await map(array, async (element: WebdriverIO.Element) => await element.getText());
  const expectedArray = [...actualArray];
  // Using the sort function on this array should do nothing if already sorted properly
  expectedArray.sort(sortFunction);
  await expect(expectedArray).toEqual(actualArray);
}

/**
 * Checks that the order in which numbers are sorted on a page matches the expected order
 * when the appropriate sorting algorithm is applied.
 * @param array An array of WebdriverIO elements
 * @param sortFunction The function to use to sort the array of elements
 */
export async function compareSortedNumberArrays(
  array: IterableCollection<WebdriverIO.Element>,
  sortFunction: (val1: number, val2: number) => number
) {
  const actualArray = await map(array, async (element: WebdriverIO.Element) => {
    const text = await element.getText();
    return parseFloat(text.replace('$', ''));
  });
  const expectedArray = [...actualArray];
  // Using the sort function on this array should do nothing if already sorted properly
  expectedArray.sort(sortFunction);
  await expect(expectedArray).toEqual(actualArray);
}
