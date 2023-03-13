import React from "react";

import { DappManagerHelper } from "./DappManagerHelper";
import striptags from "striptags";
import AnsiUp from "ansi_up";
import styled from "styled-components";
import { ScrollFollow, LazyLog } from 'react-lazylog';
import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer';
import { Button } from '@patternfly/react-core';

const terminalID = "terminal";
const refreshInterval = 2 * 1000;

const ansi_up = new AnsiUp();

const TerminalBox = styled.div`
white-space: pre;
font-size: 75%;
font-family: "Inconsolata", monospace;
overflow: auto;
height: 30rem;
padding: 1.25rem;
border-radius: 0.25rem;
background-color: #343a40;
color: white;
`;

const Comp = ({ dappManagerHelper }: { dappManagerHelper: DappManagerHelper }) => {
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    let scrollToBottom = () => {
      const el = document.getElementById(terminalID);
      if (el) el.scrollTop = el.scrollHeight;
      scrollToBottom = () => { };
    };

    async function logDnp() {
      try {
        const logs = await dappManagerHelper.getLogs();
        if (typeof logs !== "string") throw Error("Logs must be a string");
        setLogs(logs.split('\n'));
        // Auto scroll to bottom (deffered after the paint)
        setTimeout(scrollToBottom, 10);
      } catch (e: any) {
        setLogs([`Error fetching logs: ${e.message}`]);
      }
    }

    setLogs(["fetching..."]);
    const interval = setInterval(logDnp, refreshInterval);
    return () => {
      clearInterval(interval);
    };
  }, [dappManagerHelper]);

  const logViewerRef = React.useRef<any>();
  const FooterButton = () => {
    const handleClick = () => {
      // console.log(logViewerRef)
      logViewerRef.current.scrollToBottom();
    };
    return <Button onClick={handleClick}>Jump to the bottom</Button>;
  };

  return <>
  <div>
  <LogViewer
      ref={logViewerRef}
      hasLineNumbers={false}
      height={300}
      data={logs}
      theme="dark"
      footer={<FooterButton />}
    />
    {/* <LazyLog 
    extraLines={0} enableSearch
     text={ansi_up.ansi_to_html(striptags(logs || "No input"))} 
     caseInsensitive
     selectableLines
      /> */}
  </div>
  {/* <div style={{ height: 500, width: 902 }}>
  <ScrollFollow
    startFollowing
    render={({ onScroll, follow, startFollowing, stopFollowing }) => (
      <LazyLog extraLines={1} enableSearch 
      url="http://localhost:9999/logs/beacon/beacon.log" 
      stream
      follow={follow} />
    )}
  /> */}
    {/* <LazyLog 
    extraLines={1} 
    enableSearch 
    url="http://localhost:9999/logs/beacon/beacon.log" 
    caseInsensitive    
     /> 
  </div>*/}
    {/* <TerminalBox
      dangerouslySetInnerHTML={{
        __html: ansi_up.ansi_to_html(striptags(logs || "No input"))
      }}
    /> */}
  </>
}

export default Comp;

