# scot.info-cw
Web application created for a university module. Designed and developed to illustrate knowledge of client-side web design. Developed using HTML, CSS, JavaScript. Uses external APIs, Google Charts, jQuery, AJAX.

This website is best accessed using Firefox but Google Chrome may work (although I don't think it will work as well as Firefox).

Instructions:
You should start at the home page ("Home.html"). From here you can go to either Area Search or Occupation Search.
Area Search (GeographicSearch.html) - enter postcode to search for MSP details and employment statistics for that area.
Occupation Search (PayRates.html) - enter job title to search for change in weekly pay rate over the years, compares to 3 other locations.

This webapp has two main issues worth noting:
In the Occupation Search page, you may need to click the search button more than once to get all 4 lines to show,
this appears to be an issue with the API loading in.

Responsiveness must be viewed using the browser's responsive design mode which can be accessed by right-clicking and selecting "Inspect element".
There will then be some sort of icon to indicate responsive mode. In Firefox this is at the top right of the "Inspect element" panel.
For some reason it won't simply work when the window is resized normally.

Due to time constraints and browser issues, the webapp has only been modified to accomodate a mobile view as best as possible. 
This is best viewed by selecting "iPhone X/XS" in the browser's responsive design mode setting, which has been described above.

Resources used:
Google Charts - for charts/graphs
Bootstrap - simply for certain styling elements (e.g. the font), no real prominent usage
LMI for All - job payment data API
Scottish Parliament - MSP data API
jQuery - JavaScript library

Page breakdown:
HTML:						
Home.html
GeographicSearch.html
PayRates.html

JavaScript:
PayRateSearch.js (used for Occupation Search functionality, tied to PayRates.html)
MSPSearch.js (used for Area Search functionality, tid to GeographicSearch.html)

CSS:
CharityWebsite.css (applies to all pages)
GeographicSearch.css (applies to just GeographicSearch.html)
PayRates.css (applies to just PayRates.html)
