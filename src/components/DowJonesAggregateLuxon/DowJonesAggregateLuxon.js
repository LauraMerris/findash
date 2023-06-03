import { useState } from "react";
import { DateTime } from "luxon";
import ChartResponsiveLine from "../ChartResponsiveLine/ChartResponsiveLine";
import TimePicker from "../TimePicker/TimePicker";

const DowJonesAggregateLuxon = () => {

  // days and hours for multiday, otherwise hours only
  const getLabelFormat = (date, isSingleDay) => {
    return isSingleDay ? DateTime.fromMillis(date).setZone("America/New_York").toFormat('HH:mm') : DateTime.fromMillis(date).setZone("America/New_York").toFormat('ccc d HH:mm');
  };

  const [finData, setFinData] = useState([]);
  const [finHeading, setFinHeading] = useState([]);
  const [xTicks, setXTicks] = useState([]);

  const fetchFinanceData = (url,isSingleDay) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {

          let cleanedData = [];
          let xTicks = [];
          // Polygon returns no results property if no data is found

          if (data.results){
          // convert data to the format expected by Nivo
            cleanedData= [
              {
                  "id": "Dow Jones",
                  "data": data.results.map((item) => {
                    return {
                      x: getLabelFormat(item.t, isSingleDay),
                      y: item.c,
                      timestamp:item.t
                    }
                  })
              }
            ];

            if (data.results.length > 0){ 

              let num = 1;
              isSingleDay ? num = 6 : num = 78;
                xTicks = cleanedData[0].data.map((v,i) => i % num === 0 ? v.x : '');
          }

          console.log(cleanedData);

          setFinData(cleanedData);
          setXTicks(xTicks);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  const timescaleSelectedHandler = (numDays) => {

    let startDate;
    let endDate;
    let heading;
    
    let dayToShow = DateTime.now().setZone("America/New_York").minus({days:1});
    let dayNum = dayToShow.toFormat("E");

    // if it's a weekend show last friday
    if (dayNum === "6"){
      endDate = dayToShow.minus({days:1});
    } else if (dayNum === "7"){
      endDate = dayToShow.minus({days:2});
    } else {
      endDate = dayToShow;
    }
    
    switch (numDays){
      case "5":
        startDate = dayToShow.startOf('week');
        break;
      default:
        startDate = endDate;
        break;
    }
    
    // format the start and end date
    const formattedDate = endDate.toFormat("y'-'MM'-'dd");
    const formattedStart = startDate.toFormat("y'-'MM'-'dd");


    fetchFinanceData(`https://api.polygon.io/v2/aggs/ticker/I:DJI/range/5/minute/${formattedStart}/${formattedDate}?sort=asc&apiKey=UjRqanMdSmHToXKxxryGV5Fi4DCsxaSm`, numDays === "1");
    
    if (startDate.hasSame(endDate, 'day')){
      heading = endDate.toFormat("d MMMM");
    } else if (startDate.hasSame(endDate, 'month')){
      heading = `${startDate.toFormat("d")} - ${endDate.toFormat("d MMMM")}`
    } else {
      heading = `${startDate.toFormat("d MMMM")} - ${endDate.toFormat("d MMMM")}`
    }

    setFinHeading(heading);

  };

  return (
    <>
        <h2 className="heading">Dow Jones <span className="text-emphasis">{finHeading}</span></h2>
        <div className="l-align-center">
        <TimePicker onTimescaleSelected={timescaleSelectedHandler} />
        </div>
        <div className="chartWrapper">
        <ChartResponsiveLine data={finData} tickValuesX={xTicks} />
        </div>
    </>
  );
}

//const mth = values.toString().slice(0, 2);
//if (mergedDataset.includes(mth)) {
//  mergedDataset = mergedDataset.filter(item => item !== mth);
//  return `${getRequiredDateFormat(values, "MMMM-DD")}`;
//} else return "";

export default DowJonesAggregateLuxon;
