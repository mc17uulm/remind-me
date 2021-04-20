(() => {

    const get_next_execution = (last_execution, start, clocking, steps = 1) => {
        console.log(last_execution);
        console.log(start);
        let start_point;
        if(last_execution.getTime() === 0) {
            start_point = start;
        } else {
            start_point = last_execution;
        }
        let iterator = Array.from(Array(steps + 1).keys());
        iterator.shift();
        const next = iterator.map((step) => {
            const computation = (start_point.getMonth() + (step * clocking));
            const additional = Math.floor(computation / 12);
            const month = computation % 12;
            const day = start_point.getDate();
            let year = start_point.getFullYear();
            year = year + additional;
            return {day: day, month: month, year: year};
        });
        console.log(next);
    }

    get_next_execution(new Date(0), new Date(1616169360000), 4, 4);
    get_next_execution(new Date(1617638160000), new Date(1596642960000), 4, 5);

})();