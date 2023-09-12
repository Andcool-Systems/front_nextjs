"use client";

import { useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
//import { useSearchParams } from 'next/navigation'

const queryClient = new QueryClient();

export default function Page({ params }: { params: { id: string } }) {
    return <div>My Post: {params.id}</div>
  }
