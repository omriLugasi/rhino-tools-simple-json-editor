import classes from "../../jsonEditor/jsonEditor.module.scss";

interface Iprops {
}

export const NullValue = (props: Iprops) => {
    return (<div className={classes.rowValue}>NULL</div>)
}
