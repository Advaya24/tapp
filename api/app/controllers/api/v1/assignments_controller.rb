# frozen_string_literal: true

module Api::V1
    # Controller for Assignments
    class AssignmentsController < ApplicationController
        # GET /assignments
        def index
            unless params.include?(:position_id)
                render_success(Assignment.order(:id))
                return
            end
            return if invalid_id(Position, :position_id)

            render_success(assignments_by_position)
        end

        # POST /assignments
        def create
            # if we passed in an id that exists, we want to update
            update && return if params.key?(:id) && Assignment.exists?(params[:id])
            params.require(:applicant_id)
            return if invalid_id(Position, :position_id)
            return if invalid_id(Applicant, :applicant_id)

            assignment = Assignment.new(assignment_params)
            unless assignment.save # does not pass Assignment model validation
                assignment.destroy!
                render_error(assignment.errors)
                return
            end
            message = valid_wage_chunk(assignment, assignment.errors.messages)
            if !message
                render_success(assignment)
            else
                assignment.destroy!
                render_error(message)
            end
        end

        def update
            assignment = Assignment.find(params[:id])
            if assignment.update_attributes!(assignment_update_params)
                render_success(assignment)
            else
                render_error(assignment.errors)
            end
        end

        # POST /assignments/delete
        def delete
            params.require(:id)
            assignment = Assignment.find(params[:id])
            if assignment.destroy!
                render_success(assignment)
            else
                render_error(assignment.errors.full_messages.join('; '))
            end
        end

        private

        def assignment_params
            params.permit(
                :contract_start,
                :contract_end,
                :note,
                :offer_override_pdf,
                :applicant_id,
                :position_id
            )
        end

        def assignment_update_params
            params.permit(
                :contract_start,
                :contract_end,
                :note,
                :offer_override_pdf
            )
        end

        def assignments_by_position
            Assignment.order(:id).each do |entry|
                entry[:position_id].should be == params[:position_id].to_i
            end
        end

        def valid_wage_chunk(assignment, errors)
            if params.include?(:hours)
                wage_chunk = assignment.wage_chunks.new(hours: params[:hours])
                if wage_chunk.save
                    return nil
                else
                    wage_chunk.destroy!
                    return errors.deep_merge(wage_chunk.errors.messages)
                end
            else
                errors
            end
        end
    end
end
