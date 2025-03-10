/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { ClientSDK } from "../lib/sdks.js";
import { Artifacts } from "./artifacts.js";
import { Auth } from "./auth.js";
import { CodeSamples } from "./codesamples.js";
import { Events } from "./events.js";
import { Github } from "./github.js";
import { Organizations } from "./organizations.js";
import { Reports } from "./reports.js";
import { SchemaStore } from "./schemastore.js";
import { ShortURLs } from "./shorturls.js";
import { Subscriptions } from "./subscriptions.js";
import { Suggest } from "./suggest.js";
import { Workspaces } from "./workspaces.js";

export class Speakeasy extends ClientSDK {
  private _auth?: Auth;
  get auth(): Auth {
    return (this._auth ??= new Auth(this._options));
  }

  private _codeSamples?: CodeSamples;
  get codeSamples(): CodeSamples {
    return (this._codeSamples ??= new CodeSamples(this._options));
  }

  private _github?: Github;
  get github(): Github {
    return (this._github ??= new Github(this._options));
  }

  private _organizations?: Organizations;
  get organizations(): Organizations {
    return (this._organizations ??= new Organizations(this._options));
  }

  private _workspaces?: Workspaces;
  get workspaces(): Workspaces {
    return (this._workspaces ??= new Workspaces(this._options));
  }

  private _events?: Events;
  get events(): Events {
    return (this._events ??= new Events(this._options));
  }

  private _reports?: Reports;
  get reports(): Reports {
    return (this._reports ??= new Reports(this._options));
  }

  private _suggest?: Suggest;
  get suggest(): Suggest {
    return (this._suggest ??= new Suggest(this._options));
  }

  private _schemaStore?: SchemaStore;
  get schemaStore(): SchemaStore {
    return (this._schemaStore ??= new SchemaStore(this._options));
  }

  private _shortURLs?: ShortURLs;
  get shortURLs(): ShortURLs {
    return (this._shortURLs ??= new ShortURLs(this._options));
  }

  private _artifacts?: Artifacts;
  get artifacts(): Artifacts {
    return (this._artifacts ??= new Artifacts(this._options));
  }

  private _subscriptions?: Subscriptions;
  get subscriptions(): Subscriptions {
    return (this._subscriptions ??= new Subscriptions(this._options));
  }
}
