'use client'

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// This component assumes you have Tailwind CSS and Font Awesome configured in your project.
// It is a complete, literal translation of the details.html file into a single React component.

// --- Reusable Helper Components ---

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white rounded-lg shadow-sm mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4 font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-t-lg"
            >
                <span>{title}</span>
                <FontAwesomeIcon icon={faChevronDown} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-5 border border-t-0 border-gray-200 rounded-b-lg text-gray-600">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailPageLayout = ({ title, description, onBack, children }) => (
    <div className="animate-fade-in">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold transition-colors border-3 border-orange-600 p-3 rounded-md">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to All Posts
        </button>
        <h1 className="text-4xl font-bold text-gray-800 relative pb-3 mb-4">
            {title}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded"></span>
        </h1>
        {description && <p className="text-lg text-gray-600 my-8">{description}</p>}
        {children}
    </div>
);

const ChecklistSection = ({ title, description, items, strong, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-2xl font-bold text-orange-500 mb-3">{title}</h3>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {strong && <p className="font-bold text-gray-700">{strong}</p>}
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="text-orange-500 font-bold mr-3 mt-1" />
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }}></span>
                </li>
            ))}
        </ul>
        {children}
    </div>
);

// --- Individual Detail Page Components (Exact replicas from details.html) ---

const NewOwnersGuide = ({ onBack }) => (
    <DetailPageLayout
        title="Guide for New Pet Owners"
        description="Congratulations on welcoming a new pet into your family! Starting your pet ownership journey can be both exciting and overwhelming. This comprehensive guide will help you navigate the essentials and set you up for success."
        onBack={onBack}
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            <div className="lg:col-span-2 space-y-6">
                <ChecklistSection title="Essential Supplies Checklist" description="Before bringing your new pet home, make sure you have these essential items ready:" items={["Comfortable bed or sleeping area", "Food and water bowls (stainless steel or ceramic)", "High-quality pet food appropriate for age and breed", "Collar with ID tag", "Leash for dogs", "Litter box and litter for cats", "Grooming supplies (brush, nail clippers, pet shampoo)", "Toys for mental stimulation", "First aid kit", "Carrier for vet visits"]} />
                <ChecklistSection title="Preparing Your Home" description="Create a safe and welcoming environment for your new companion:" items={["Remove toxic plants and hazardous materials from reach", "Secure loose wires and cables", "Set up a designated sleeping area", "Create a quiet space where they can retreat when overwhelmed", "Install baby gates if needed to restrict access to certain areas", "Store cleaning supplies and medications in secure cabinets"]} />
                <ChecklistSection title="First Vet Visit" description="Schedule a veterinary appointment within the first week of bringing your pet home. Your vet will:" items={["Conduct a comprehensive health examination", "Review vaccination schedule and administer necessary shots", "Discuss spaying/neutering options and timing", "Check for parasites and provide preventive treatments", "Answer any questions about your pet's health and care", "Set up a regular check-up schedule"]} />
                <ChecklistSection title="Nutrition Basics" description="Proper nutrition is fundamental to your pet's health and well-being:" items={["Choose high-quality food appropriate for your pet's age, size, and breed", "Feed consistent portions at regular times each day", "Provide fresh, clean water at all times", "Avoid feeding human foods that can be toxic to pets", "Monitor your pet's weight and adjust portions as needed", "Consult your vet before making any dietary changes"]} />
                <ChecklistSection title="Creating a Routine" description="Pets thrive on consistency and predictability. Establish routines for:" items={["Feeding times - same times each day", "Exercise and play sessions", "Bathroom breaks for dogs", "Grooming and hygiene care", "Training sessions - short, positive sessions", "Bedtime - consistent sleep schedule"]} />
            </div>
            <aside className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-orange-500 sticky top-24">
                    <h4 className="text-xl font-bold text-orange-500 mb-4">Quick Tips</h4>
                    <ul className="space-y-2 text-gray-700">
                        <li>✓ Be patient - adjustment takes time</li>
                        <li>✓ Use positive reinforcement</li>
                        <li>✓ Socialize early and often</li>
                        <li>✓ Keep emergency vet info handy</li>
                        <li>✓ Take lots of photos!</li>
                        <li>✓ Join a pet owner community</li>
                        <li>✓ Consider pet insurance</li>
                        <li>✓ Microchip your pet</li>
                    </ul>
                </div>
            </aside>
        </div>
        <div className="bg-orange-500 text-white p-10 rounded-lg text-center my-10">
            <h3 className="text-3xl font-bold mb-4">Download Our Complete New Pet Owner Guide</h3>
            <p className="max-w-2xl mx-auto mb-6">Get our comprehensive 50-page guide with detailed checklists, training tips, and expert advice to help you and your new pet thrive together!</p>
            <button className="bg-white text-orange-500 font-bold px-8 py-3 rounded-lg hover:bg-orange-100 transition-colors">Download Free Guide</button>
        </div>
    </DetailPageLayout>
);

const PetCareHub = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('dogs');
    return (
        <DetailPageLayout title="Pet Care & Wellness Hub" description="Comprehensive care guides to keep your pets healthy, happy, and thriving at every stage of life." onBack={onBack}>
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('dogs')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'dogs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Dogs</button>
                    <button onClick={() => setActiveTab('cats')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'cats' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Cats</button>
                    <button onClick={() => setActiveTab('general')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'general' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>General Care</button>
                </nav>
            </div>
            <div className="animate-fade-in">
                {activeTab === 'dogs' && <div className="space-y-6"><ChecklistSection title="Dog Nutrition" description="Dogs need a balanced diet with the right mix of nutrients:" items={["Feed high-quality dog food with meat as primary ingredient", "Ensure balanced mix of proteins, fats, and carbohydrates", "Provide fresh, clean water at all times", "Consider dog's size, breed, and activity level for portions", "Avoid human foods like chocolate, grapes, and onions"]} /><ChecklistSection title="Exercise Requirements" description="Regular exercise is crucial for your dog's physical and mental health:" items={["Most dogs need 30-60 minutes of exercise daily", "High-energy breeds may need 2+ hours of activity", "Include walks, playtime, and mental stimulation", "Adjust exercise based on age and health conditions", "Swimming is excellent low-impact exercise"]} /></div>}
                {activeTab === 'cats' && <div className="space-y-6"><ChecklistSection title="Cat Nutrition" description="Cats are obligate carnivores with specific dietary needs:" items={["Choose food with high-quality proteins and taurine", "Cats need meat-based diet as obligate carnivores", "Wet food helps with hydration", "Limit carbohydrates in feline diet", "Provide multiple water sources"]} /><ChecklistSection title="Litter Box Care" description="Proper litter box maintenance is essential for cat health and happiness:" items={["Have one litter box per cat, plus one extra", "Scoop daily, change litter weekly", "Place boxes in quiet, accessible locations", "Use unscented, clumping litter most cats prefer", "Keep boxes away from food and water"]} /></div>}
                {activeTab === 'general' && <div className="space-y-6"><ChecklistSection title="Grooming Essentials" items={[]}><p className="font-bold text-gray-700">Coat Care:</p><ul className="list-disc list-inside pl-4 mb-4"><li>Brush regularly to remove loose hair</li><li>Bathe as needed with pet-specific shampoo</li></ul><p className="font-bold text-gray-700">Dental Health:</p><ul className="list-disc list-inside pl-4"><li>Brush teeth with pet-safe toothpaste</li><li>Provide dental chews</li></ul></ChecklistSection><ChecklistSection title="Health Monitoring" description="Recognizing signs of illness early can save your pet's life:" items={["Changes in eating or drinking habits", "Lethargy or decreased activity", "Vomiting or diarrhea lasting more than 24 hours", "Difficulty breathing or coughing", "Limping or signs of pain"]} /></div>}
            </div>
            <h2 className="text-orange-500 text-3xl font-bold mt-12 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3"><AccordionItem title="How often should I take my pet to the vet?">For healthy adult pets, annual wellness exams are recommended. Puppies and kittens need more frequent visits (every 3-4 weeks until 16 weeks old). Senior pets (7+ years) should see the vet twice yearly. Always schedule immediate visits if you notice signs of illness or injury.</AccordionItem><AccordionItem title="What human foods are safe for pets?">Safe options include plain cooked chicken, turkey, lean beef, carrots, green beans, pumpkin, blueberries, and plain rice. Always avoid chocolate, grapes, raisins, onions, garlic, avocados, alcohol, caffeine, and foods with xylitol. Introduce new foods gradually and in moderation.</AccordionItem><AccordionItem title="How can I tell if my pet is overweight?">You should be able to feel your pet's ribs without pressing hard. When viewed from above, they should have a visible waist. From the side, the belly should tuck up. If these features aren't present, consult your vet about a weight management plan.</AccordionItem><AccordionItem title="How much exercise does my pet need?">Dogs typically need 30-120 minutes daily depending on breed, age, and energy level. Cats benefit from 20-30 minutes of active play daily. Adjust exercise based on your pet's individual needs, health status, and weather conditions.</AccordionItem></div>
        </DetailPageLayout>
    );
};

const CommunityStories = ({ onBack }) => (
    <DetailPageLayout title="Pet Stories & Community" description="Share in the joy, challenges, and triumphs of pet ownership. Read heartwarming stories from our community and contribute your own!" onBack={onBack}>
        <div className="bg-gradient-to-r from-orange-100 via-cream-50 to-white p-8 rounded-lg mb-12 grid md:grid-cols-2 gap-8 items-center shadow-lg">
            <img src="https://pplx-res.cloudinary.com/image/upload/v1760767348/pplx_project_search_images/038c80bb063ad7de8d171020dbfc6403302cdfe9.png" alt="Pet of the week" className="rounded-lg shadow-lg w-full h-full object-cover" />
            <div>
                <h3 className="text-3xl font-bold text-orange-600 mb-3">🏆 Pet of the Week: Humphrey</h3>
                <p className="text-gray-700 mb-2"><strong>Meet Humphrey!</strong> This adorable Golden Retriever puppy has stolen our hearts with his infectious smile and playful personality. At just 12 weeks old, Humphrey is already mastering basic commands and loves making new friends at the dog park. His favorite activities include chasing tennis balls, playing in water sprinklers, and snuggling on the couch after a busy day of puppy adventures.</p>
                <p className="text-gray-600 italic">Owner Sarah says: "Humphrey has brought so much joy to our family. His enthusiasm for life is contagious, and we love watching him discover new things every day!"</p>
            </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-orange-500 mt-12 mb-6">Community Stories</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-2"><img src="https://pplx-res.cloudinary.com/image/upload/v1755070242/pplx_project_search_images/a2bd6a3103afe2c4c615bb274395fd44fea6401d.png" alt="Adoption story" className="w-full h-48 object-cover" /><div className="p-5"><h3 className="text-xl font-bold text-orange-500 mb-2">Max Finds His Forever Home</h3><p className="text-sm text-gray-600 mb-2">After 6 months in the shelter, Max the golden retriever found his perfect family. His new owners share their adoption journey and the incredible bond they've formed.</p><p className="text-xs text-gray-500"><strong>By Sarah Johnson</strong> • October 15, 2025</p></div></div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-2"><img src="https://pplx-res.cloudinary.com/image/upload/v1760767348/pplx_project_search_images/afda1f1312a82c9ab9e1d407d9f56bbfdaf3366d.png" alt="Training success" className="w-full h-48 object-cover" /><div className="p-5"><h3 className="text-xl font-bold text-orange-500 mb-2">Training Success with Luna</h3><p className="text-sm text-gray-600 mb-2">How consistent positive reinforcement transformed our anxious rescue dog into a confident companion. Learn about the techniques that worked for us.</p><p className="text-xs text-gray-500"><strong>By Michael Chen</strong> • October 20, 2025</p></div></div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-2"><img src="https://pplx-res.cloudinary.com/image/upload/v1755081561/pplx_project_search_images/85a198758f522b2a0158d82bca3ee0f33b7e4e2b.png" alt="Health journey" className="w-full h-48 object-cover" /><div className="p-5"><h3 className="text-xl font-bold text-orange-500 mb-2">Whiskers' Health Journey</h3><p className="text-sm text-gray-600 mb-2">Recognizing the early signs of kidney disease saved our cat's life. Here's what we learned about the importance of regular vet checkups and monitoring.</p><p className="text-xs text-gray-500"><strong>By Emily Rodriguez</strong> • October 18, 2025</p></div></div>
        </div>
        <div className="bg-orange-50 p-10 rounded-lg mt-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-2">Share Your Story</h2>
            <p className="mb-6 text-gray-600">We'd love to hear about your pet's journey! Share your adoption story, training triumph, or heartwarming moment with our community.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for sharing!'); e.target.reset(); }} className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-gray-700 font-semibold mb-1" htmlFor="storyName">Your Name</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" type="text" id="storyName" required /></div><div><label className="block text-gray-700 font-semibold mb-1" htmlFor="petName">Pet's Name</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" type="text" id="petName" required /></div></div><div><label className="block text-gray-700 font-semibold mb-1" htmlFor="storyTitle">Story Title</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" type="text" id="storyTitle" required /></div><div><label className="block text-gray-700 font-semibold mb-1" htmlFor="storyCategory">Category</label><select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" id="storyCategory" required><option value="">Select a category</option><option value="adoption">Adoption Success</option><option value="training">Training Triumph</option><option value="health">Health Journey</option><option value="heartwarming">Heartwarming Moment</option><option value="other">Other</option></select></div><div><label className="block text-gray-700 font-semibold mb-1" htmlFor="storyContent">Your Story</label><textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" id="storyContent" rows="5" required></textarea></div><button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">Submit Story</button></form>
        </div>
    </DetailPageLayout>
);

const TrainingHub = ({ onBack }) => (
    <DetailPageLayout title="Pet Training & Behavior Hub" description="Master the art of training your pets with positive reinforcement techniques that build trust, improve communication, and strengthen your bond." onBack={onBack}>
        <div className="border-b border-gray-200 mb-8"><nav className="-mb-px flex space-x-8"><button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base border-orange-500 text-orange-600">Dogs</button><button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Cats</button></nav></div>
        <div className="space-y-6">
            <ChecklistSection title="Basic Commands" description="Every dog should know these essential commands for safety and good behavior:" items={["<strong>Sit:</strong> Helps manage excitement and impulse control.", "<strong>Stay:</strong> Teaches patience and discipline.", "<strong>Come:</strong> Ensures recall and safety during outdoor activities.", "<strong>Leave It:</strong> Prevents eating or grabbing harmful items.", "<strong>Heel:</strong> Promotes calm leash walking without pulling."]} />
            <ChecklistSection title="House Training" description="Consistency and patience are key when teaching your dog proper bathroom habits:" items={["Take your dog out at the same times daily (after meals, naps, and play).", "Reward successful outdoor potty trips immediately.", "Clean accidents with enzyme cleaner to remove odor.", "Supervise closely indoors to prevent mistakes.", "Crate training can help establish routine and control."]} />
        </div>
        <h2 className="text-orange-500 text-3xl font-bold mt-12 mb-5">Training FAQs</h2>
        <div className="space-y-3"><AccordionItem title="When should I start training my pet?">Training should begin as early as 8 weeks for puppies and kittens. Early training helps prevent behavioral issues and builds good habits that last a lifetime. However, it’s never too late — even adult pets can learn with patience and consistency.</AccordionItem><AccordionItem title="How long should training sessions last?">Keep sessions short and engaging — 5 to 15 minutes is ideal. Frequent, short sessions are more effective than long ones. End each session on a positive note with praise or playtime.</AccordionItem></div>
    </DetailPageLayout>
);

const BehaviorHub = ({ onBack }) => (
    <DetailPageLayout title="Pet Behavior & Psychology Hub" description="Understand your pet’s emotions, instincts, and behavioral patterns. Learning to interpret their body language and actions helps strengthen your bond." onBack={onBack}>
        <div className="border-b border-gray-200 mb-8"><nav className="-mb-px flex space-x-8"><button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base border-orange-500 text-orange-600">Dogs</button><button className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Cats</button></nav></div>
        <div className="space-y-6">
            <ChecklistSection title="Understanding Dog Body Language" description="Dogs communicate primarily through body language. Learn to read their signals:" items={["<strong>Tail Wagging:</strong> Fast wag = excitement; slow, stiff wag = alert or uneasy.", "<strong>Ears:</strong> Forward = attentive; flattened = fear or submission.", "<strong>Eyes:</strong> Soft gaze shows calmness; direct stare can mean tension.", "<strong>Posture:</strong> Relaxed = comfort; crouched or stiff = anxiety or aggression.", "<strong>Yawning/Licking Lips:</strong> Common signs of stress or discomfort."]} />
            <ChecklistSection title="Common Behavioral Issues" description="Dogs often display unwanted behaviors due to stress, boredom, or miscommunication:" items={["Barking excessively — often from lack of stimulation or anxiety.", "Chewing furniture or shoes — a sign of boredom or teething in puppies.", "Jumping on people — excitement or seeking attention.", "Digging — natural instinct, especially for certain breeds.", "Aggression — often fear-based; requires professional assessment."]} />
        </div>
        <h2 className="text-orange-500 text-3xl font-bold mt-12 mb-5">Behavior FAQs</h2>
        <div className="space-y-3"><AccordionItem title="Why is my dog suddenly acting aggressive?">Sudden aggression can result from pain, fear, or environmental changes. Rule out medical causes first by consulting your vet, then work with a certified behaviorist to identify and correct triggers safely.</AccordionItem><AccordionItem title="Why does my cat bite or scratch during petting?">This is often a sign of overstimulation. Cats have limits on touch tolerance — watch for tail flicking or twitching skin as early signs to stop before a bite occurs. Keep sessions short and let your cat control interaction length.</AccordionItem></div>
    </DetailPageLayout>
);

const ContactPage = ({ onBack }) => (
    <DetailPageLayout title="Get In Touch" description="Have questions, suggestions, or just want to say hello? We'd love to hear from you! Fill out the form below or reach out through our social media channels." onBack={onBack}>
        <div className="grid md:grid-cols-5 gap-10 mt-10">
            <div className="md:col-span-3 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-orange-500 mb-6">Send Us a Message</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); e.target.reset(); }} className="space-y-5">
                    <div><label className="block text-gray-700 font-semibold mb-2" htmlFor="contactName">Name</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" type="text" id="contactName" required /></div>
                    <div><label className="block text-gray-700 font-semibold mb-2" htmlFor="contactEmail">Email</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" type="email" id="contactEmail" required /></div>
                    <div><label className="block text-gray-700 font-semibold mb-2" htmlFor="contactSubject">Subject</label><input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" type="text" id="contactSubject" required /></div>
                    <div><label className="block text-gray-700 font-semibold mb-2" htmlFor="contactMessage">Message</label><textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" id="contactMessage" rows="5" required></textarea></div>
                    <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">Send Message</button>
                </form>
            </div>
            <div className="md:col-span-2 space-y-6">
                <div className="bg-orange-100 p-6 rounded-lg border-l-4 border-orange-400">
                    <h4 className="font-bold text-lg text-orange-600 mb-2">📧 Email Us</h4>
                    <p className="text-gray-700">hello@pawsomepetcare.com</p>
                    <p className="text-sm text-gray-500">We typically respond within 24-48 hours.</p>
                </div>
                <div className="bg-orange-100 p-6 rounded-lg border-l-4 border-orange-400">
                    <h4 className="font-bold text-lg text-orange-600 mb-2">📱 Follow Us</h4>
                    <p className="text-gray-700">Facebook: @PawsomePetCare<br />Instagram: @pawsome_pets<br />Twitter: @PawsomeCare</p>
                </div>
                <div className="bg-orange-100 p-6 rounded-lg border-l-4 border-orange-400">
                    <h4 className="font-bold text-lg text-orange-600 mb-2">📮 Newsletter</h4>
                    <p className="text-gray-700 mb-3">Subscribe to receive weekly pet care tips, stories, and exclusive content!</p>
                    <input type="email" placeholder="Your email address" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400" /><button className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">Subscribe</button>
                </div>
            </div>
        </div>
        <h2 className="text-orange-500 text-3xl font-bold mt-16 mb-5">Frequently Asked Questions About Our Blog</h2>
        <div className="space-y-3"><AccordionItem title="Is the content on your blog written by veterinarians?">Our content is created by a team of experienced pet care professionals, including veterinarians, certified trainers, and long-time pet owners. All medical advice is reviewed by licensed veterinarians to ensure accuracy and safety.</AccordionItem><AccordionItem title="Can I submit a guest post?">Yes! We love featuring stories and expertise from our community. Please email us at hello@pawsomepetcare.com with your topic idea and a brief outline. We'll review submissions and respond within 2 weeks.</AccordionItem><AccordionItem title="How can I get my pet featured as Pet of the Week?">We'd love to feature your pet! Send us 2-3 high-quality photos and a short description (100-200 words) about your pet's personality, favorite activities, and what makes them special. Email submissions to hello@pawsomepetcare.com with "Pet of the Week" in the subject line.</AccordionItem></div>
    </DetailPageLayout>
);

const CommunityGrid = ({ onNavigate }) => {
    const blogPosts = [
        { id: 'new-owners', imgSrc: "https://pplx-res.cloudinary.com/image/upload/v1760767348/pplx_project_search_images/038c80bb063ad7de8d171020dbfc6403302cdfe9.png", category: "New Owners", title: "7 Essential Tips for New Pet Owners", excerpt: "Learn the fundamentals of welcoming a new furry friend into your home." },
        { id: 'care', imgSrc: "https://pplx-res.cloudinary.com/image/upload/v1760767348/pplx_project_search_images/afda1f1312a82c9ab9e1d407d9f56bbfdaf3366d.png", category: "Nutrition", title: "Understanding Pet Nutrition", excerpt: "A guide to feeding your pet a balanced, healthy diet." },
        { id: 'stories', imgSrc: "https://pplx-res.cloudinary.com/image/upload/v1761333454/pplx_project_search_images/506cea8b947c2a39b1e8877dafdee714427b8dba.png", category: "Community", title: "Heartwarming Pet Stories", excerpt: "Read and share stories about the joy pets bring to our lives." },
        { id: 'training', imgSrc: "https://pplx-res.cloudinary.com/image/upload/v1761333438/pplx_project_search_images/6d7be8d9bfbff999b74786fb7af7a2eb1deb6db8.png", category: "Training", title: "Training Your Dog", excerpt: "Positive reinforcement techniques for obedience and socialization." },
        { id: 'behavior', imgSrc: "https://pplx-res.cloudinary.com/image/upload/v1755081561/pplx_project_search_images/85a198758f522b2a0158d82bca3ee0f33b7e4e2b.png", category: "Behavior", title: "Cat Behavior Decoded", excerpt: "Understanding what your feline friend is trying to tell you." },
        { id: 'contact', imgSrc: "https://pplx-res.cloudinary.com/image/upload/v1755070242/pplx_project_search_images/a2bd6a3103afe2c4c615bb274395fd44fea6401d.png", category: "Contact", title: "Get In Touch", excerpt: "Have questions or suggestions? We'd love to hear from you." }
    ];

    return (
        <div className="animate-fade-in">
            <div className="bg-orange-50 p-10 rounded-lg my-10 text-center">
                <h2 className="text-orange-600 text-3xl font-bold mb-5">About Our Community</h2>
                <p className="text-gray-700 max-w-3xl mx-auto">At Pawsome Pet Care, we believe every pet deserves the best. Our mission is to provide owners with guides, expert advice, and a supportive community to celebrate the joy of pet companionship.</p>
            </div>
            <h2 className="text-center text-gray-800 text-3xl font-bold mb-10">Featured Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col">
                        <img src={post.imgSrc} alt={post.title} className="w-full h-48 object-cover" />
                        <div className="p-6 flex flex-col flex-grow">
                            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-3 self-start">{post.category}</span>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm flex-grow">{post.excerpt}</p>
                            <button onClick={() => onNavigate(post.id)} className="mt-auto self-start inline-block px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold transition-colors duration-300 hover:bg-orange-600">Read More</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Community = () => {
    const [activeView, setActiveView] = useState('grid');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeView]);

    const renderView = () => {
        switch (activeView) {
            case 'new-owners': return <NewOwnersGuide onBack={() => setActiveView('grid')} />;
            case 'care': return <PetCareHub onBack={() => setActiveView('grid')} />;
            case 'stories': return <CommunityStories onBack={() => setActiveView('grid')} />;
            case 'training': return <TrainingHub onBack={() => setActiveView('grid')} />;
            case 'behavior': return <BehaviorHub onBack={() => setActiveView('grid')} />;
            case 'contact': return <ContactPage onBack={() => setActiveView('grid')} />;
            default: return <CommunityGrid onNavigate={setActiveView} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {renderView()}
            </div>
        </div>
    );
};

export default Community;