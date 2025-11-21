import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://genydjiymltjefdfqsjz.supabase.co";
const supabaseAnonKey = "sb_publishable__x_zqCJel8ZxzTA2rt4j-g_DNZ3IRCg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

