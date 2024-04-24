const { ApolloServer, gql } = require("apollo-server");

let events = [
  {
    id: "1",
    name: "IPL 2024",
    date: "2024-05-10",
    sport: "Soccer",
    participants: [
      { id: "101", name: "Punit Tripathi", age: 25 },
      { id: "102", name: "Shudhansu tripathi", age: 28 },
    ],
  },
  {
    id: "2",
    name: "Pro Kabbadi League",
    date: "2024-06-15",
    sport: "Basketball",
    participants: [
      { id: "201", name: "rana", age: 40 },
      { id: "202", name: "yash", age: 35 },
    ],
  },
];

const typeDefs = gql`
  type Event {
    id: ID!
    name: String!
    date: String!
    sport: String!
    participants: [Participant]!
  }

  type Participant {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    events: [Event]
    event(id: ID!): Event
  }

  type Mutation {
    createEvent(name: String!, date: String!, sport: String!): Event
    registerParticipant(eventId: ID!, participant: ParticipantInput!): Event
  }

  input ParticipantInput {
    id: ID!
    name: String!
    age: Int!
  }
`;

const resolvers = {
  Query: {
    events: () => events,
    event: (_, { id }) => events.find((event) => event.id === id),
  },
  Mutation: {
    createEvent: (_, { name, date, sport }) => {
      const newEvent = {
        id: String(events.length + 1),
        name,
        date,
        sport,
        participants: [],
      };
      events.push(newEvent);
      return newEvent;
    },
    registerParticipant: (_, { eventId, participant }) => {
      const eventIndex = events.findIndex((event) => event.id === eventId);
      if (eventIndex === -1) {
        throw new Error("Event not found!");
      }
      events[eventIndex].participants.push(participant);
      return events[eventIndex];
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
