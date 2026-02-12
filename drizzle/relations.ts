import { relations } from "drizzle-orm/relations";
import { events, eventRegistrations, users, innovatorApplications, sponsorRequests } from "./schema";

export const eventRegistrationsRelations = relations(eventRegistrations, ({one}) => ({
	event: one(events, {
		fields: [eventRegistrations.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [eventRegistrations.userId],
		references: [users.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	eventRegistrations: many(eventRegistrations),
	user: one(users, {
		fields: [events.organizerId],
		references: [users.id]
	}),
	innovatorApplications: many(innovatorApplications),
	sponsorRequests: many(sponsorRequests),
}));

export const usersRelations = relations(users, ({many}) => ({
	eventRegistrations: many(eventRegistrations),
	events: many(events),
	innovatorApplications: many(innovatorApplications),
	sponsorRequests: many(sponsorRequests),
}));

export const innovatorApplicationsRelations = relations(innovatorApplications, ({one}) => ({
	event: one(events, {
		fields: [innovatorApplications.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [innovatorApplications.innovatorId],
		references: [users.id]
	}),
}));

export const sponsorRequestsRelations = relations(sponsorRequests, ({one}) => ({
	event: one(events, {
		fields: [sponsorRequests.eventId],
		references: [events.id]
	}),
	user: one(users, {
		fields: [sponsorRequests.sponsorId],
		references: [users.id]
	}),
}));