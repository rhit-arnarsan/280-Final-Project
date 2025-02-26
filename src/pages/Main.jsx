
import { Week } from '../components/Week.jsx';
import { TopBar } from '../components/TopBar.jsx';


export function Main() {
    return (
        <>
        {TopBar()}
        {[1,2,3,4,5,6,7].map(i => Week(i))}
        </>
    );
}