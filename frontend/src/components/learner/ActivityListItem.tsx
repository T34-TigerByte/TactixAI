// import type { LearnerActivity } from "../../schemas/api.schema";


// interface ActivityListItemProps {
//     activity: LearnerActivity
// }

// export default function ActivityListItem ({activity}: ActivityListItemProps) {
//     return (
//       <div
//         key={activity.user_name}
//         className='flex items-center justify-between
//                                         px-3 py-4 rounded-lg hover:bg-gray-50
//                                         transition-colors'
//       >
//         <div className='space-y-1.5'>
//           <p className='font-semibold text-gray-900 text-sm'>
//             {activity.title}
//           </p>
//           <div className='flex items-center gap-2'>
//             {/* <DifficultyBadge level={activity.difficulty} /> */}
//             {activity.date && (
//               <span className='text-gray-400 text-xs'>{activity.date}</span>
//             )}
//           </div>
//         </div>

//         {/* Scores / Status */}
//         {activity.status === 'completed' && activity.score !== null ? (
//           <span
//             className={`font-bold text-lg ${
//               activity.score >= 80 ? 'text-teal-500' : 'text-orange-500'
//             }`}
//           >
//             {activity.score}%
//           </span>
//         ) : (
//           <span
//             className='px-3 py-1 rounded-full text-xs font-semibold
//                                                 bg-orange-500 text-white'
//           >
//             In Progress
//           </span>
//         )}
//       </div>
//     );
// }