import { Agent, AgentModenaUniversalRegistry, AgentModenaUniversalResolver, IdentityPlainTextDataShareBehavior, VerifiableCredentialWithInfo, WACIMessage, WACIProtocol } from "@extrimian/agent";
import { Config } from "../config";
import { FileSystemAgentSecureStorage } from "../filesystem-secure-storage";
import { FileSystemStorage } from "../filesystme-storage";
import { MemoryAgentSecureStorage, MemoryAgentStorage } from "../memory-agent-storage";
import { IssuerWACIProtocol } from "./issuer-waci-protocol";

export const getIssuerAgent = async (): Promise<Agent> => {
    const agent = new Agent({
        agentStorage: new FileSystemStorage({ filepath: 'issuer-agent.json' }),
        secureStorage: new FileSystemAgentSecureStorage({ filepath: 'issuer-agent-secure-storage.json' }),
        vcStorage: new FileSystemStorage({ filepath: 'issuer-agent-secure-storage.json' }),
        didDocumentRegistry: new AgentModenaUniversalRegistry(Config.modenaURL, Config.modenaDIDMethod),
        didDocumentResolver: new AgentModenaUniversalResolver(Config.modenaURL),
        vcProtocols: [IssuerWACIProtocol.getWACIProtocol()],
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