import { DID, WACIProtocol, WACICredentialOfferSucceded, VerifiableCredential } from "@extrimian/agent";
import { MemoryAgentSecureStorage, MemoryAgentStorage } from "../memory-agent-storage";
import frame from "./frame.json";
import inputDescriptors from "./input-descriptors.json";

export class VerifierWACIProtocol {
    static getWACIProtocol() {
        return new WACIProtocol({
            storage: new MemoryAgentStorage(),
            verifier: {
                presentationDefinition: async (invitationId) => {
                    return {
                        inputDescriptors: [inputDescriptors],
                        frame: frame,
                    }
                },
            }
        })
    }
}