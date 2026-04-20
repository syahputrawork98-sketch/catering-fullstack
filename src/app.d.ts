// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

import { type DefaultSession } from "@auth/sveltekit";

declare module "@auth/sveltekit" {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'CUSTOMER_SERVICE' | 'USER';
      status: 'PENDING' | 'ACTIVE';
    } & DefaultSession["user"]
  }
}

declare module "@auth/core/types" {
  interface User {
    role?: 'ADMIN' | 'CUSTOMER_SERVICE' | 'USER';
    status?: 'PENDING' | 'ACTIVE';
  }
}

export {};
