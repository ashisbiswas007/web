import {Paper, AppBar, Button} from "@mui/material";
import AppContext from "../../context/AppContext"
import React, {useState, useContext, useRef, useEffect} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import L from 'leaflet';
import {Close} from '@mui/icons-material';
import {makeStyles} from "@material-ui/core/styles";
import TrackTabList from "../TrackTabList";
import WeatherTabList from "../WeatherTabList";

const useStyles = makeStyles({
    menu: {
        bottom: '10%',
        left: '30%',
        width: '800px',
        height: "auto",
    },
    centerStyle: {
        left: "50%",
        transform: 'translate(-50%, 0%)'
    }
})


export default function MapContextMenu() {
    const ctx = useContext(AppContext);
    const classes = useStyles();
    const [showContextMenu, setShowContextMenu] = useState(false);

    const graphWidth = 600;
    let tabsObj = definitionTabs();

    let tabList = tabsObj ? tabsObj.tabList : [];
    const [value, setValue] = useState(tabsObj ? tabsObj.defaultTab : 'general');
    let tabs = tabsObj ? tabsObj.tabs : null;
    const divContainer = useRef(null);

    useEffect(() => {
        if (divContainer.current) {
            L.DomEvent.disableClickPropagation(divContainer.current);
            L.DomEvent.disableScrollPropagation(divContainer.current);
        }
    });

    function definitionTabs() {
        if (ctx.currentObjectType === 'cloud_track' || ctx.currentObjectType === 'local_server_track') {
            return new TrackTabList().create(ctx, graphWidth);
        }
        if (ctx.currentObjectType === 'weather' && ctx.weatherPoint) {
            return new WeatherTabList().create(ctx, graphWidth);
        }
    }

    useEffect(() => {
        if (ctx.currentObjectType) {
            setShowContextMenu(true);
        }
    }, [ctx.currentObjectType, ctx.setCurrentObjectType]);


    function closeContextMenu() {
        setShowContextMenu(false);
    }

    return (<div>
        {showContextMenu && <div className={`${classes.centerStyle} ${'leaflet-bottom'}`} ref={divContainer}>
            <div className="leaflet-control leaflet-bar padding-container">
                {tabList.length > 0 &&
                    <Paper>
                        <TabContext value={value}>
                            {Object.values(tabs).map((item, index) =>
                                <TabPanel value={item.key + ''} key={'tabpanel:' + item.key}> {item} </TabPanel>)
                            }
                            <AppBar position="static" color="default">
                                <div style={{display: 'inherit'}}>
                                    <Button key='close' onClick={() => {
                                        closeContextMenu()
                                    }}>
                                        <Close/>
                                    </Button>
                                    <TabList onChange={(e, newValue) => setValue(newValue)} children={tabList}/>
                                </div>
                            </AppBar>
                        </TabContext>
                    </Paper>
                }
            </div>
        </div>}
    </div>);
}