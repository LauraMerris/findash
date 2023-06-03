import TimePicker from "../TimePicker/TimePicker";
import { useState } from "react";
import ChartResponsiveLine from "../ChartResponsiveLine/ChartResponsiveLine";

const DowJonesAggregate = () => {

  // days and hours for multiday, otherwise hours only
  const getLabelFormat = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US",{timeZone: "America/New_York", day:"2-digit", hour12:false, hour: "2-digit", minute: "2-digit"});
  };


  const getDateParts = (date,locale,options) => {
    const intD = new Intl.DateTimeFormat(locale, options);
    return intD.formatToParts(date);
  }

  const [finData, setFinData] = useState([]);
  const [finHeading, setFinHeading] = useState([]);

  const fetchFinanceData = (url) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {

          let cleanedData = [];
          // Polygon returns no results property if no data is found

          if (data.results){
          // convert data to the format expected by Nivo
            cleanedData= [
              {
                  "id": "Dow Jones",
                  "data": data.results.map((item) => {
                    return {
                      x: getLabelFormat(item.t),
                      y: item.c
                    }
                  })
              }
            ];
          }

          setFinData(cleanedData);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  // get the last day before date defined by numDay as sunday = 0 to saturday = 6
  const getClosestDay = (date, dayToFindAsNumber) => {

    // can't use Date.getDay because it needs to be in the correct timezone
    const parts = getDateParts(date, "en-US", {timeZone: "America/New_York", weekday: 'long'});
    const currentDay = parts.find(item => item.type ==="weekday");
    let offset;

    // relies on the 'long' weekday being returned.
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayAsNumber = dayOfWeek.indexOf(currentDay.value);

    // go back 7 days if today is the day being requested
    dayToFindAsNumber === currentDayAsNumber ? offset = 7 : offset = Math.abs(dayToFindAsNumber - 7 - currentDayAsNumber) % 7;
    return date - (60 * 60 * 24 * 1000 * offset);
  }

  // formats a date as yyyy-mm-dd
  const formatDateAsString = (date) => {

    const options = {timeZone: "America/New_York", weekday: 'long', year: 'numeric', month: '2-digit', day: 'numeric', hour12:false, hour: "2-digit", minute: "2-digit" };
    const parts = getDateParts(date, "en-US", options);
    
    const monthItem = parts.find(item => item.type==="month");
    const month = monthItem.value;
    const dayItem = parts.find(item => item.type === "day");
    const day = dayItem.value;
    const yearItem = parts.find(item => item.type === "year");
    const year = yearItem.value;

    // if anything's missing - exit here

    return `${year}-${month}-${day}`;
  }

  // format dates as 6 May || 6 - 12 May || 31 May - 2 June
  const formatDateRangeAsString = (startDate, endDate) => {
    const options = {timeZone: "America/New_York", day: 'numeric', month:'long'}
    const parts = getDateParts(startDate, "en-US", options);
    const endParts = getDateParts(endDate, "en-US", options);
    const startDayLabel = parts.find(item => item.type === "day").value;
    const startMonthLabel = parts.find(item => item.type === "month").value;
    const endDayLabel = endParts.find(item => item.type === "day").value;
    const endMonthLabel = endParts.find(item => item.type === "month").value;

    let heading;

    if (startDayLabel === endDayLabel && startMonthLabel === endMonthLabel){
      heading = `${startDayLabel} ${startMonthLabel}`;
    } else if(startMonthLabel === endMonthLabel){
      heading = `${startDayLabel} - ${endDayLabel} ${startMonthLabel}`
    } else {
      heading = `${startDayLabel} ${startMonthLabel} - ${endDayLabel} ${endMonthLabel}`
    }
    return heading;

  }

  const isWeekendInNewYork = (date) => {
    const parts = getDateParts(date, "en-US", {timeZone: "America/New_York", weekday: 'long'});
    const currentDay = parts.find(item => item.type ==="weekday");

    if (currentDay === "Saturday" || currentDay === "Sunday" || currentDay === "Monday"){
      return true;
    } else {
      return false;
    }
  }

  const timescaleSelectedHandler = (numDays) => {

    let startDate;
    let endDate;
    
    if (isWeekendInNewYork){
      endDate = getClosestDay(Date.now(), 5);  // last friday
    } else {
      endDate = Date.now() - 60 * 60 * 24 * 1000;
    }
    

    switch (numDays){
      case "5":
        startDate = getClosestDay(endDate, 1); // last monday
        break;
      default:
        startDate = endDate;
        break;
    }
    
    // format the start and end date
    const formattedDate = formatDateAsString(endDate);
    let formattedStart;

    if (startDate === endDate){
      formattedStart = formattedDate;
    } else {
      formattedStart = formatDateAsString(startDate);
    }

    fetchFinanceData(`https://api.polygon.io/v2/aggs/ticker/I:DJI/range/5/minute/${formattedStart}/${formattedDate}?sort=asc&apiKey=UjRqanMdSmHToXKxxryGV5Fi4DCsxaSm`);
    
    // get heading
    const heading = formatDateRangeAsString(startDate, endDate);
    setFinHeading(heading);
  };

  return (
    <>
        <h2 className="heading">Dow Jones <span className="text-emphasis">{finHeading}</span></h2>
        <div className="l-align-center">
        <TimePicker onTimescaleSelected={timescaleSelectedHandler} />
        </div>
        <div className="chartWrapper">
        <ChartResponsiveLine data={finData} />
        </div>
    </>
  );
}

export default DowJonesAggregate;
