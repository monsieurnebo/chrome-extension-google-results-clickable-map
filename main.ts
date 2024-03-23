// Restaurant, bar, cafe, food, point_of_interest, establishment, etc
const PRIVATE_PLACE_THUMBNAIL_ID = 'lu_map'

// City, country, state, street, etc
const PUBLIC_PLACE_THUMBNAIL_ID = 'dimg_3'


function getMapThumbnail() {
  const privatePlaceMap = document.getElementById(PRIVATE_PLACE_THUMBNAIL_ID);
  if (privatePlaceMap) {
    return {
      type: 'privatePlace',
      element: privatePlaceMap
    }
  }

  const publicPlaceMap = document.getElementById(PUBLIC_PLACE_THUMBNAIL_ID);
  if (publicPlaceMap) {
    return {
      type: 'publicPlace',
      element: publicPlaceMap
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

  console.log('Map thumbnail found & made clickable')

  wrapElementInLink(mapThumbnail.element)
  enableParentLink(mapThumbnail.element)
}

main()


