
import { Week, Day, dayToWeek } from '../components/Week.jsx';
import { TopBar } from '../components/TopBar.jsx';

function weekNames(offset) {
    if (offset <= -3) return `${offset} weeks back`
    if (offset == -2) return "Last Last week";
    if (offset == -1) return "Last week";
    if (offset == 0) return "This week";
    if (offset == 1) return "Next week";
    if (offset == 2) return "Next Next week";
    if (offset >= 3) return `${offset} weeks in the future`
}

export function Main() {
    const currentWeek = dayToWeek(new Date());
    const BACK = -3;

    const weeks = []
    for (let i = BACK; i < 4; i++) {
        weeks.push(currentWeek.getNthWeekOffset(i));
    }

    return (
        <>
        {TopBar()}
        {weeks.map((week, i) => Week(weekNames(i+BACK), week))}
        </>
    );
}