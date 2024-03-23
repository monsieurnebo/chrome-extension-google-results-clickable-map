/**
 * Small map thumbnail
 * It appears on the right panel gathering information regarding a place (e.g. restaurant, theater, etc)
 */
const SMALL_MAP_THUMBNAIL_SELECTOR = '#lu_map'

/**
 * Big map thumbnail
 * It appears right below the search bar, usually for a precise address
 */
const BIG_MAP_THUMBNAIL_SELECTOR = '#dimg_3'

/**
 * Interactive iframe map
 * It appears in results such as "city" and can be set fullscreen and interacted with
 */
const INTERACTIVE_MAP_SELECTOR = '.Lx2b0d'

function getMapThumbnail() {
  const interactiveMap = document.querySelector(INTERACTIVE_MAP_SELECTOR);
  if (interactiveMap) {
    console.log('Interactive map iframe found')

    return {
      type: 'interactiveMap',
      element: interactiveMap
    }
  }

  const smallMap = document.querySelector(SMALL_MAP_THUMBNAIL_SELECTOR);
  if (smallMap) {
    console.log('Private place map thumbnail found')

    return {
      type: 'smallMap',
      element: smallMap
    }
  }

  const bigMap = document.querySelector(BIG_MAP_THUMBNAIL_SELECTOR);
  if (bigMap) {
    console.log('Public place map thumbnail found')

    return {
      type: 'publicPlace',
      element: bigMap
    }
  }

  return null
}

function wrapElementInLink(element) {
  // 1. Create the wrapper element
  const wrapperLink = document.createElement('a');

  // 2. Insert it before the targeted element
  element.parentNode.insertBefore(wrapperLink, element);

  // 3. Move the targeted element into the wrapper
  wrapperLink.appendChild(element);

  return wrapperLink
}

function enableParentLink(element) {
  const link = window.location.href;
  const step = link.split('q=')[1];
  const query = step.split('&')[0];

  element.parentElement.setAttribute('href', 'https://www.google.com/maps?q=' + query);
}


function main() {
  console.log('Searching for a map thumbnail...')

  const mapThumbnail = getMapThumbnail();

  if (!mapThumbnail) {
    console.log('No map thumbnail found in the Google results')

    return null
  }

  wrapElementInLink(mapThumbnail.element)
  enableParentLink(mapThumbnail.element)
}

main()


