import { RestApi } from "./shared/RestApi";
import { DappManagerHelper } from "./shared/DappManagerHelper";
import { SupervisorCtl } from "./shared/SupervisorCtl";
import Logs from "./shared/Logs";

interface Props {
    restApi: RestApi | undefined | null
    dappManagerHelper: DappManagerHelper
    supervisorCtl: SupervisorCtl | undefined
}

const Comp = ({ restApi, dappManagerHelper, supervisorCtl }: Props) => {


    const toggleLighthouse = (enable: boolean) => {
        const method = enable ? 'supervisor.startProcess' : 'supervisor.stopProcess'
        supervisorCtl?.callMethod(method, ["lighthouse"]);
    }
    return (
        <>
            <h2 className="title is-2 has-text-white">Debug</h2>
            <div className="content">
                <ul>
                    {restApi && (
                        <li>
                            <a href={`${restApi?.baseUrl}/swagger-ui`} target="_blank" rel="noopener noreferrer">Swagger RPC UI</a>

                        </li>
                    )}
                    {dappManagerHelper && (
                        <li>
                            <a href={`http://my.ava.do/#/Packages/${dappManagerHelper.packageName}/detail`} target="_blank" rel="noopener noreferrer">Avado package management page</a>

                        </li>
                    )}
                </ul>
                {supervisorCtl && <div className="field">
                    <button className="button" onClick={() => toggleLighthouse(true)}>Start Lighthouse</button>
                    <button className="button" onClick={() => toggleLighthouse(false)}>Stop Lighthouse</button>
                </div>
                }

                {dappManagerHelper && (<Logs dappManagerHelper={dappManagerHelper} />)}
            </div>

        </>
    )
}

export default Comp;