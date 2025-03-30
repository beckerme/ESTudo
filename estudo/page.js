import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const data = await supabase.from('todos').select()

  return (
    <ul>
      {data?.map((data) => (
        <li>{data}</li>
      ))}
    </ul>
  )
}
