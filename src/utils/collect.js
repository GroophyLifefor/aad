(async () => {
  /*
  {
    "ancestorOrigins": {},
    "href": "https://github.com/GroophyLifefor/aad",
    "origin": "https://github.com",
    "protocol": "https:",
    "host": "github.com",
    "hostname": "github.com",
    "port": "",
    "pathname": "/GroophyLifefor/aad",
    "search": "",
    "hash": ""
  }
  */
  const aad_site = window.location;

  if (aad_site.origin === 'https://github.com' && aad_site.pathname !== '/') {
    chrome.storage.local.get(['collect_recommend'], (items) => {
      /*
      [
        {
          "lastOpen": "2024-06-01T19:29:56.325Z",
          "openCount": 12,
          "openTimes": [
              79955,
              80013,
              80908,
              80915,
              80996
          ],
          "path": "/GroophyLifefor/Clee"
        }
      ]
      */
      const collect_recommend = items.collect_recommend || [];
      const index = collect_recommend.findIndex(
        (item) => item.path === aad_site.pathname
      );
      if (index === -1) {
        const date = new Date();
        collect_recommend.push({
          path: aad_site.pathname,
          openCount: 1,
          lastOpen: date.toISOString(),
          openTimes: [
            date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds(),
          ],
        });

        chrome.storage.local.set({ collect_recommend });
      } else {
        const date = new Date();
        collect_recommend[index].openCount++;
        collect_recommend[index].lastOpen = date.toISOString();
        collect_recommend[index].openTimes.push(
          date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
        );
        if (collect_recommend[index].openTimes.length > 5) {
          collect_recommend[index].openTimes.shift();
        }

        chrome.storage.local.set({ collect_recommend });
      }
    });
  }

  function secondsToTime(seconds) {
    // Calculate hours
    const hours = Math.floor(seconds / 3600);
    // Calculate remaining seconds after extracting hours
    const remainingSeconds = seconds % 3600;
    // Calculate minutes
    const minutes = Math.floor(remainingSeconds / 60);

    // Format hours and minutes to always be two digits
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Return the formatted time
    return `${formattedHours}:${formattedMinutes}`;
  }

  // Helper function to normalize an array
  function normalize(array) {
    const max = Math.max(...array);
    const min = Math.min(...array);
    return array.map((value) => (value - min) / (max - min));
  }

  // Helper function to calculate average
  function calculateAverage(array) {
    const sum = array.reduce((a, b) => a + b, 0);
    return sum / array.length;
  }

  // Helper function to calculate standard deviation
  function calculateStandardDeviation(array, average) {
    const variance =
      array.reduce((a, b) => a + Math.pow(b - average, 2), 0) / array.length;
    return Math.sqrt(variance);
  }

  // Function to calculate the proximity score based on the current time
  function calculateTimeProximityScore(currentTimeSeconds, averageOpenTime) {
    const secondsInDay = 24 * 60 * 60;
    const diff = Math.abs(currentTimeSeconds - averageOpenTime);
    const proximity = Math.min(diff, secondsInDay - diff); // Circular difference
    return 1 - proximity / (secondsInDay / 2); // Normalize to 0-1, where 0 is far and 1 is close
  }

  // Function to calculate the score for each URL
  function calculateScores(data, currentTime) {
    const currentTimeSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    const openCounts = data.map((item) => item.openCount);
    const lastOpens = data.map((item) => new Date(item.lastOpen).getTime());
    const normalizedOpenCounts = normalize(openCounts);
    const normalizedLastOpens = normalize(lastOpens);

    return data.map((item, index) => {
      const averageOpenTime = calculateAverage(item.openTimes);
      const stdDevOpenTime = calculateStandardDeviation(
        item.openTimes,
        averageOpenTime
      );

      const normalizedOpenCount = normalizedOpenCounts[index];
      const normalizedLastOpen = normalizedLastOpens[index];
      const timeProximityScore = calculateTimeProximityScore(
        currentTimeSeconds,
        averageOpenTime
      );

      const score =
        normalizedOpenCount * 0.3 +
        normalizedLastOpen * 0.5 +
        (1 - stdDevOpenTime / averageOpenTime) * 0.1 +
        timeProximityScore * 0.1;
      return {
        ...item,
        score,
        scoreDetails: {
          openCount: normalizedOpenCount * 0.3,
          lastOpen: normalizedLastOpen * 0.5,
          stdDevOpenTime: (1 - stdDevOpenTime / averageOpenTime) * 0.1,
          timeProximityScore: timeProximityScore * 0.1,
        },
        stdDevOpenTime: secondsToTime(stdDevOpenTime),
        averageOpenTime: secondsToTime(averageOpenTime),
        currentTimeSeconds: secondsToTime(currentTimeSeconds),
        timeProximityScore: timeProximityScore.toFixed(2),
      };
    });
  }

  // Function to recommend URLs based on their scores
  function recommendUrls(data, currentTime) {
    const scoredData = calculateScores(data, currentTime);
    scoredData.sort((a, b) => b.score - a.score);
    return scoredData;
  }

  chrome.storage.local.get(['collect_recommend'], (items) => {
    // console.log('collect recommend raw', items.collect_recommend);
    const currentTime = new Date();

    const recommendedUrls = recommendUrls(items.collect_recommend, currentTime);
    // console.log('collect recommend scored', recommendedUrls);
  });
})();
