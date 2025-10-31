import { differenceInDays } from "date-fns";

export default function JoinedDays({ date }) {
    const daysAgo = differenceInDays(new Date(), new Date(date));
    return <span>{daysAgo}</span>;
}
