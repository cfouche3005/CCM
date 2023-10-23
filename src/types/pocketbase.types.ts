/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import { type RecordService } from 'pocketbase'

export enum Collections {
	MonitoredSoftware = "monitored_software",
	Provider = "provider",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type MonitoredSoftwareRecord<Tactions = unknown, Ttags = unknown> = {
	actions?: null | Tactions
	icon?: string
	name?: string
	nr_id?: string
	nr_url?: string
	project?: string
	provider?: RecordIdString
	tags?: null | Ttags
	topic?: string
}

export type ProviderRecord<Tchangelog_url = unknown> = {
	changelog_url?: null | Tchangelog_url
	name?: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type MonitoredSoftwareResponse<Tactions = unknown, Ttags = unknown, Texpand = unknown> = Required<MonitoredSoftwareRecord<Tactions, Ttags>> & BaseSystemFields<Texpand>
export type ProviderResponse<Tchangelog_url = unknown, Texpand = unknown> = Required<ProviderRecord<Tchangelog_url>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	monitored_software: MonitoredSoftwareRecord
	provider: ProviderRecord
	users: UsersRecord
}

export type CollectionResponses = {
	monitored_software: MonitoredSoftwareResponse
	provider: ProviderResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'monitored_software'): RecordService<MonitoredSoftwareResponse>
	collection(idOrName: 'provider'): RecordService<ProviderResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
