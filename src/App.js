import "./App.css";
import Card from "./components/Card/Card";
import DowJonesAggregateLuxon from "./components/DowJonesAggregateLuxon/DowJonesAggregateLuxon";

function App() {

  return (
    <div className="">
      <section className="grid">
        <Card>
          Some other exciting component here. Maybe this one's about money too.
        </Card>
        <Card>
          <DowJonesAggregateLuxon />
        </Card>

      </section>
    </div>
  );
}

export default App;
