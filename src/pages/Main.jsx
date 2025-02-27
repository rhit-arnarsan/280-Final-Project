
import { List, dayToWeek } from '../components/Week.jsx';
import { TopBar } from '../components/TopBar.jsx';


export function Main() {
    return (
        <>
        {TopBar()}
        {List()}
        </>
    );
}