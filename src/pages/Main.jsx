
import { Week, dayToWeek } from '../components/Week.jsx';
import { TopBar } from '../components/TopBar.jsx';


export function Main() {
    return (
        <>
        {TopBar()}
        {[1].map(i => Week(i, dayToWeek(new Date())))}
        </>
    );
}