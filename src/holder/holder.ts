import { Agent, AgentModenaUniversalRegistry, AgentModenaUniversalResolver, IdentityPlainTextDataShareBehavior, VerifiableCredentialWithInfo, WACIMessage, WACIProtocol } from "@extrimian/agent";
import { Config } from "../config";
import { FileSystemAgentSecureStorage } from "../filesystem-secure-storage";
import { FileSystemStorage } from "../filesystme-storage";
import { MemoryAgentSecureStorage, MemoryAgentStorage } from "../memory-agent-storage";
import { HolderWACIProtocol } from "./holder-waci-protocol";

export const getHolderAgent = async (): Promise<Agent> => {
    const agent = new Agent({
        agentStorage: new FileSystemStorage({ filepath: 'holder-agent.json' }),
        secureStorage: new FileSystemAgentSecureStorage({ filepath: 'holder-agent-secure-storage.json' }),
        vcStorage: new FileSystemStorage({ filepath: 'holder-agent-secure-storage.json' }),
        didDocumentRegistry: new AgentModenaUniversalRegistry(Config.modenaURL, Config.modenaDIDMethod),
        didDocumentResolver: new AgentModenaUniversalResolver(Config.modenaURL),
        vcProtocols: [HolderWACIProtocol.getWACIProtocol()],
    });

    await agent.initialize();
 
    if (agent.identity.getOperationalDID() == null) {
        const createDID = new Promise<void>(async (resolve, reject) => {
            agent.identity.didCreated.on((did) => {
                resolve();
            })

            agent.identity.createNewDID({
                dwnUrl: Config.dwnURL,
            });
        });

        await createDID;
    }

    return agent;
}