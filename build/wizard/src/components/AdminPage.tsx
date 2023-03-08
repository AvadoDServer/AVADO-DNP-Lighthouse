import { RestApi } from "./shared/RestApi";
import { DappManagerHelper } from "./shared/DappManagerHelper";
import Logs from "./shared/Logs";

interface Props {
    restApi: RestApi | undefined | null
    dappManagerHelper: DappManagerHelper
}

const Comp = ({ restApi, dappManagerHelper }: Props) => {


    const toggleNimbus = async (enable: boolean) => {
        restApi?.post("/service/restart", {}, (res) => { }, (err) => { })
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
                {
                    <div className="field">
                        <button className="button" onClick={() => toggleNimbus(true)}>Start Nimbus</button>
                        <button className="button" onClick={() => toggleNimbus(false)}>Stop Nimbus</button>
                    </div>
                }

                {dappManagerHelper && (<Logs dappManagerHelper={dappManagerHelper} />)}
            </div>

        </>
    )
}

export default Comp;
