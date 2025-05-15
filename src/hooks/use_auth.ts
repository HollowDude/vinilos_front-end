import { BACKEND } from "../types/commons";

export async function refreshCSRF() {
    await fetch(`${BACKEND}/api/auth/check/`, {
      method: 'GET',
      credentials: 'include', 
    });
    // tras esto document.cookie ya contendrá 'csrftoken'
  }
  