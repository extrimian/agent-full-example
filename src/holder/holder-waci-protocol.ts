import { DID, WACIProtocol, WACICredentialOfferSucceded, VerifiableCredential } from "@extrimian/agent";
import { MemoryAgentSecureStorage, MemoryAgentStorage } from "../memory-agent-storage";

export class HolderWACIProtocol {
    static getWACIProtocol() {
        return new WACIProtocol({
            storage: new MemoryAgentStorage(),
            holder: {
                credentialApplication: async (inputs, message?, issuer?, credentialsToReceive?): Promise<VerifiableCredential<any>[]> => {
                    if (inputs.length == 0 || inputs[0].credentials.length == 0) return [];

                    return [inputs[0].credentials[0].data];
                },
            }
        })
    }
}