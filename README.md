# Firebase Authentication Example

## Software Requirements

- [Node.js 20](https://nodejs.org/en)

## Design Decisions

- client side validation is a usability feature
- server side validation is a security feature

- Auth is handled by server side API routes
- Firebase configuration and authorization should only be handled on the client for small and non-sensitive
  applications.
- While things like IP whitelisting can assist in making API keys less easy to abuse, it is still not ideal.