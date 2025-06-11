const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 🔐 Use your actual Supabase keys
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Plans (can be removed later)
const plans = [ /* ... same plan list ... */ ];

app.post('/api/subscribe', async (req, res) => {
  const { userId, planId, method } = req.body;

  const selectedPlan = plans.find(p => p.id === planId);
  if (!selectedPlan) return res.status(404).json({ message: 'Plan not found' });

  const { error } = await supabase
    .from('subscriptions')
    .insert([{ user_id: userId, plan_id: planId, method, status: 'pending' }]);

  if (error) return res.status(500).json({ success: false, error });

  res.json({ success: true, message: `Subscribed to ${selectedPlan.name}` });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));