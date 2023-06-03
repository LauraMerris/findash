// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const ChartResponsiveLine = (props) => {
   
    return (
        <ResponsiveLine
            data={props.data}
            margin={{ top: 32, right: 20, bottom: 80, left: 50 }}
            xScale={{ 
                type: 'point',
            }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                //tickSize: 5,
                format:  v => props.tickValuesX.find(vts => vts === v) ? v : "",
                //tickValues: props.tickValuesX,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: 80,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: -80,
                legendPosition: 'middle'
            }}
            enableGridX={false}
            colors={{scheme: 'purpleRed_green'}}
            pointSize={1}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
        />
    )
}

export default ChartResponsiveLine;